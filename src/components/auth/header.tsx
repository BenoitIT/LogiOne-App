import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <header className=" w-full flex flex-col gap-y-4 items-center">
            <Link href="/">
                <Image src="/images/loginOne.png" width={100} height={100} alt="logo" />
            </Link>
            <p className="text-mute">
                {label}
            </p>
        </header>
    )
}

