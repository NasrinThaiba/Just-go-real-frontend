type NewsMetaProps = {
  logo?: string;
  name: string;
};

export default function NewsMeta({
  logo = "/logo.png",
  name,
}: NewsMetaProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logo}
        alt={name}
        className="h-6 w-6 rounded-sm object-cover"
      />

      <span className="text-sm font-semibold text-foreground">
        {name} 
      </span>
    </div>
  );
}