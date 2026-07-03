import React from 'react';
import { Code, Sparkles } from 'lucide-react';

function Header() {
    return (
        <header className="border-b border-neutral-800/80 bg-black/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-b from-white to-neutral-300 p-2 rounded-lg shadow-[0_1px_8px_rgba(255,255,255,0.15)]">
                            <Code className="h-5 w-5 text-black" />
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight text-white">
                            SiteSculptor
                        </h1>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center space-x-2 bg-neutral-900 text-neutral-400 border border-neutral-800 px-3 py-1.5 rounded-full text-sm font-medium">
                            <Sparkles className="h-4 w-4 text-neutral-300" />
                            <span>&copy; Sagar B J</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
