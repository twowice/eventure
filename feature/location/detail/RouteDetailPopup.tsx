import { InfomationPopup } from "@/components/popup/infomation";

export const RouteDetailPopup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <InfomationPopup
      dialogTrigger={children}
      title="test"
      body={
        <div>
          <p>테스트중입니다.</p>
        </div>
      }
    ></InfomationPopup>
  );
};
