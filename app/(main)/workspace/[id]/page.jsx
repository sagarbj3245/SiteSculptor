import ChatView from '@/components/custom/ChatView';
import CodeView from '@/components/custom/CodeView';
import React from 'react';

const Workspace = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]">
                <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle_400px_at_50%_250px,rgba(255,255,255,0.05),transparent)]" />
            </div>

            <div className="relative z-10 p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                    <div className="lg:col-span-4">
                        <ChatView />
                    </div>
                    <div className="lg:col-span-8">
                        <CodeView />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;
