interface Props {
  token: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function AuthButton({ token, onLogin, onLogout }: Props) {
  if (!token) {
    return (
      <button
        onClick={onLogin}
        className="px-3 py-1.5 rounded-[6px] border border-accent text-accent text-xs font-sans hover:bg-accent-dim transition-colors duration-150"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-accent-dim border border-accent flex items-center justify-center text-accent text-xs font-mono font-medium select-none">
        G
      </div>
      <button
        onClick={onLogout}
        className="text-xs text-text-tertiary hover:text-text-secondary transition-colors duration-150 font-sans"
      >
        Sign out
      </button>
    </div>
  );
}
