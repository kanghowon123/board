import Title from "@/components/Title";
import { IMAGE } from "@/app/constants/images";
import HouseholdList from "./HouseholdList";
import HouseholdWrite from "./HouseholdWrite";
export default function HouseHoldPage() {
  return (
    <section className="w-full">
      <Title image={IMAGE.household1}>가계부</Title>
      <div className="w-7xl mx-auto py-20">
        <HouseholdList />
      </div>
      <HouseholdWrite />
    </section>
  );
}
