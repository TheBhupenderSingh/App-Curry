import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ModuleLandingProps {
  title: string;
  assignPath: string;
  reviewPath: string;
}

export default function ModuleLanding({ title, assignPath, reviewPath }: ModuleLandingProps) {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{title} Module</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button onClick={() => navigate(assignPath)}>Assign Cases</Button>
          <Button variant="outline" onClick={() => navigate(reviewPath)}>
            Review Cases
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
