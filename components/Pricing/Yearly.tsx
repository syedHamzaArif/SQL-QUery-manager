

import PlanCard from "@components/PlanCard";
import * as React from "react";
import { AnnualPlan } from "../../mock/Pricing";

interface IYearlyProps {}

const Yearly: React.FunctionComponent<IYearlyProps> = (props) => {
  return (
    <React.Fragment>
      {AnnualPlan.map((p:any, i:any) => (
        <PlanCard
          key={i}
          name={p.name}
          title={p.title}
          price={p.price}
          benefits={p.benefits}
          isAnnual={true}
          priceId={p.priceId}
        />
      ))}
    </React.Fragment>
  );
};

export default Yearly;
