import React, { useState } from 'react';
import { X, Hash, FileText, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useRoomStore from '../../zustand/roomStore';

const CreateRoomDialog = ({ onClose }) => {
    const navigate = useNavigate();
    const { roomLoading, createRoom ,fetchAllRooms} = useRoomStore();
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description) {
            toast("Enter all fields");
            return;
        }

        const res = await createRoom(formData);
        if (res) {
            toast.success("Room created, redirecting...", {
                duration: 2000,
            })
            await fetchAllRooms();
            setTimeout(() => {
                navigate(`/room/${res}`);
            }, 2000);
            
        }

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">

            {/* 2. MODAL BOX */}
            {/* - Click stops propagation so clicking inside doesn't close it */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1e293b] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
            >

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary">
                            <Sparkles size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Create Room</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-muted hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Room Name</label>
                            <div className="relative group">
                                <Hash className="absolute left-3 top-3 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted/30"
                                    placeholder="e.g. Debugging Squad"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Description</label>
                            <div className="relative group">
                                <FileText className="absolute left-3 top-3 text-muted group-focus-within:text-primary transition-colors" size={18} />
                                <textarea
                                    rows="3"
                                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted/30 resize-none"
                                    placeholder="What's this room for?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-muted hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={roomLoading}
                                className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {roomLoading ? <Loader2 size={18} className="animate-spin" /> : "Create Space"}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default CreateRoomDialog;