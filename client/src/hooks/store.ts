import { create } from "zustand";

type userStore = {
	userName: string;
	userTitle: string;
	setUserName: (name: string) => void;
	setUserTitle: (name: string) => void;
};

export const useUserStore = create<userStore>((set) => ({
	userName: "Sabinus",
	userTitle: "Investor",

	// setUserName: (name: string) =>
	// 	set((state) => ({ ...state, userName: name })),

	// setUserTitle: (title: string) =>
	// 	set((state) => ({ ...state, userTitle: title })),

	setUserName: function (name: string) {
		return set(function (state) {
			return { ...state, userName: name };
		});
	},

	setUserTitle: function (title: string) {
		return set(function (state) {
			return { ...state, userTitle: title };
		});
	},
}));
