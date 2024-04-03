'use client';

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInoutProps {
    placeholder?: string
    id: string
    type?: string
    required?: boolean
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors 
}

const MessageInput: React.FC<MessageInoutProps> = ({
    placeholder, id, register, required, errors, type
}) => {
  return (
    <div className="relative w-full">
        <input type={type} autoComplete={id} id={id} {...register(id, {required})} placeholder={placeholder} className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none" />
    </div>
  )
}

export default MessageInput