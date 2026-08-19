import { cn } from "@/lib/utils"
import { Loader } from "./loader"

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Loader
      size="xs"
      className={cn("inline-flex", className)}
      {...props}
    />
  )
}

export { Spinner }
