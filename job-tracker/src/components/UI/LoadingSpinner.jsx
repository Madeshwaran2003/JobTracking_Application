export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-dark-600 border-t-accent-blue animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-accent-purple animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
    </div>
  );
}
