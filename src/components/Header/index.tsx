import Link from "next/link";

type HeaderProps = {
  children: React.ReactNode;
}

export default function Header({children}: HeaderProps) {
  return (
    <div className="flex items-center">
      <h1 className="text-2xl font-bold"> {children} </h1>
      <Link href="/messages" className="text-blue-500 hover:text-blue-700 block inline-block ml-4">Voltar</Link>
    </div>
  )
}