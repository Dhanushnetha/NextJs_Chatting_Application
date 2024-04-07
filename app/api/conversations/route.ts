import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request){
    try {
        const currentUser = await getCurrentUser();

        const body = await req.json();
        const {
            userId, isGroup, members, name
        } = body

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized', {status: 401})
        }

        if(isGroup && (!members || members.length < 2  || !name )){
            return new NextResponse('Invalid data', {status: 400});
        }

        if(isGroup){

			const Ids = members.map((user: {value: string})=> user.value);
			Ids.push(currentUser.id);

            const checkExsistingGroupConverstion = await prisma.conversation.findMany({
                where:{
                    // AND: Ids.map((userId: any) => ({userIds: {hasEvery: userId}}))
					userIds: {
						hasEvery: Ids,
					}
                }
            })

			const filteredConversations = checkExsistingGroupConverstion.filter(conversation => 
				conversation.userIds.every(userId => Ids.includes(userId))
			);
            
            if(filteredConversations.length > 0){
				return NextResponse.json({conversation: filteredConversations[0], message: 'Group already exists!!' });
			}

            const newConversation = await prisma.conversation.create({
                data:{
                    name, isGroup, users:{
                        connect:[
                            ...members.map((member: {value: string})=>({
                                id: member.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include:{
                    users: true
                }
            })

            newConversation.users.forEach((user)=>{
                if(user.email){
                    pusherServer.trigger(user.email, 'conversation:new', newConversation);
                }
            })
            return NextResponse.json({conversation: newConversation, message: 'Group created!!' });
        }

        const exsistingConversations = await prisma.conversation.findMany({
            where:{
                OR:[
                    {
                        userIds:{
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds:{
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        })

        const singleConversation = exsistingConversations[0];

        if(singleConversation){
            return NextResponse.json(singleConversation);
        }

        const newconversation = await prisma.conversation.create({
            data: {
                users:{
                    connect:[
                        {
                            id: currentUser.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include:{
                users: true
            }
        })

        newconversation.users.map((user)=>{
            if(user.email){
                pusherServer.trigger(user.email, 'conversation:new', newconversation);
            }
        })

        return NextResponse.json(newconversation);

    } catch (error: any) {
        return new NextResponse('Internal Error', {status: 500})
    }
}