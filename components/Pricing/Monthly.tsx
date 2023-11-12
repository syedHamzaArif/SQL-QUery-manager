
// import PlanCard from "@components/Profile/PlanCard";
import PlanCard from "@components/PlanCard";
import * as React from "react";
import { MonthlyPlan } from "../../mock/Pricing";

interface IMonthlyProps {}

const Monthly: React.FunctionComponent<IMonthlyProps> = (props) => {
  return (
    <React.Fragment>
      {MonthlyPlan.map((p:any, i:any) => (
        <PlanCard
          key={i}
          name={p.name}
          title={p.title}
          price={p.price}
          benefits={p.benefits}
          isAnnual={p.isAnnual}
          priceId={p.priceId}
        />
      ))}
    </React.Fragment>
  );
};

export default Monthly;
