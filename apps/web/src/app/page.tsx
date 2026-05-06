import Image from "next/image";
import { Button } from "@kakamu/ui";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button> Click me </Button>
    </div>
  );
}
