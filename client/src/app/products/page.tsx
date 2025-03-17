import Link from "next/link";


export default function Home() {
  return (
    <div>
      <h1 className="font-bold text-2xl">Home</h1>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/list">See all</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
