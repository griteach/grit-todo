import { HomeCard } from "@/components/card/home_card";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <HomeCard />
      </div>
    </div>
  );
}
