import Header from "@/components/Header";
import { getMessagesById } from "@/lib/getMessagesById";
import Link from "next/link";
import { notFound } from "next/navigation";

type MessagePageProps = {
  params: Promise<{
    id: number;
  }>
}

export default async function MessagePage({params}: MessagePageProps) {
  const {id} = await params;
  const res = await getMessagesById(id);
  
  if(res.error) {
    notFound();
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
    <Header>
      voce esta vendo o post de id: {id}
    </Header>
    <div className="mt-4">
      <h2 className="text-xl font-bold">Mensagem de: {res.message?.name}</h2>
      <p className="text-white text-lg">{res.message?.message}</p>
    </div>
  </div>
  )
}


