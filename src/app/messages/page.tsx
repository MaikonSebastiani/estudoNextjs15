import { getAllMessages } from "@/lib/getAllMessages";
import Link from "next/link";

export default async function MessagesPage() {
  const {messages} = await getAllMessages();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todas as Mensagens</h1>
      <div className="">
        {messages.map((message) => (
          <div key={message.id} className="border-b border-gray-300 p-4">
            <h2>{message.name}</h2>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <Link href="/messages/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4 inline-block">
        Nova Mensagem
      </Link>
    </div>
  )
}