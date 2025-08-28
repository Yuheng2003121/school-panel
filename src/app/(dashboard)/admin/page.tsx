import Announcements from "@/components/Announcements";
import AttendenceChartContainer from "@/components/AttendenceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";


type SearchParams = Promise<{ [key: string]: string | undefined }>;
export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const { date } = resolvedSearchParams;
  
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/*left  */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* user cards */}
        <div className="flex gap-4 flex-wrap justify-between">
          {["student", "teacher", "parent", "admin"].map((type, index) => (
            <UserCard
              type={type as "admin" | "teacher" | "student" | "parent"}
              key={type}
              color={index % 2 === 0 ? "bg-myPurple" : "bg-myYellow"}
            />
          ))}
        </div>

        {/* middle charts */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* count chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>

          {/* attendence chhart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendenceChartContainer />
          </div>
        </div>

        {/* bottom charts */}
        <div className="w-full h-[500px] ">
          <FinanceChart />
        </div>
      </div>

      {/* right */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* calendar */}
        <div>
          <EventCalendarContainer date={date} />
          <Announcements />
        </div>
      </div>
    </div>
  );
}
