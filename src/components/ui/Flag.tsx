interface FlagProps {
  code: string
  className?: string
}

export default function Flag({ code, className = '' }: FlagProps) {
  if (!code) return <span className={`inline-block bg-gray-200 rounded-sm ${className}`} />
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      className={`inline-block object-cover ${className}`}
    />
  )
}
