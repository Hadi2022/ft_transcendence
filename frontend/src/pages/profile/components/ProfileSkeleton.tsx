  export default function ProfileSkeleton() {

    return (
        <div className="animate-pulse flex flex-col items-center gap-6
                        sm:flex-row sm:items-start sm:gap-10">
        {/* avatar */}

        <div className="size-24 sm:size-36 shrink-0
                        rounded-full bg-soft-text/20" />

            <div className="flex w-full flex-col items-center gap-3 sm:items-start">
                <div className="h-7 w-40 rounded bg-soft-text/20" />                {/* username */}
                <div className="h-4 w-28 rounded bg-soft-text/20" />                {/* nombre */}
                <div className="h-4 w-full max-w-sm rounded bg-soft-text/20" />     {/* bio */}
                <div className="h-4 w-2/3 max-w-xs rounded bg-soft-text/20" />      {/* bio */}
                <div className="h-9 w-32 rounded-md bg-soft-text/30" />             {/* botón */}
            </div>
        </div>
      )
  }
