type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="🔎 Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full max-w-md mx-auto block"
      />
    </div>
  );
}
