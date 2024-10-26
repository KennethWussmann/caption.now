import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getModels } from "@/lib/ollama-api-client";
import { useQuery } from "@tanstack/react-query";

export const ModelSelector = () => {
  const { data, isLoading, isError, isLoadingError } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
    refetchInterval: 1000,
  });

  return (
    <Select
      disabled={
        !data || data?.length === 0 || isLoading || isError || isLoadingError
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        {data?.map((model) => (
          <SelectItem value={model.name} key={model.name}>
            {model.name}
          </SelectItem>
        )) ?? <></>}
      </SelectContent>
    </Select>
  );
};
