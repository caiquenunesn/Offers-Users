import Link from "next/link";

export function LinkGit(){
    return(
        <div>
    <Link
    href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
    className="hover:text-gray-500 transition-colors">
      <p><span className="underline">
        Crie sua conta{' '}
        </span>
      com github</p>
    </Link>
    </div>
    )
}