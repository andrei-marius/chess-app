import React, { createContext, useState, useContext, useMemo } from 'react';

export const Context = createContext(null);

export default function ContextProvider({ children} ) {
	const [mostFrequent, setMostFrequent] = useState(null)
	const [side, setSide] = useState(null)
	const [user, setUser] = useState(null);

	const contextValue = useMemo(() => ({ 
		mostFrequent,
		setMostFrequent,
		side,
		setSide,
		user,
		setUser,
	}), [mostFrequent, setMostFrequent, side, setSide, user, setUser]);

	return (
		<Context.Provider value={contextValue}>
			{children}
		</Context.Provider>
	);
}

export function useCustomContext() {
	const context = useContext(Context);

	if (!context) {
		throw new Error('useContext must be used within a ContextProvider');
	}

	return context;
}