import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { createCategory } from "../../../backend/controllers/category.controller";


export const useCategoryStore = create((set, get) => ({
    categories: [],
    loading: false,

    getCategories: async () => {
		
		try {
			const response = await axios.get(`/category`);
            
			set({ categories: response.data, loading: false });
            console.log(response.data)
            

		} catch (error) {
			toast.error(error.response.data.error || "Failed to fetch categories");
		}
	},

    createCategory: async (category) => {
		set({ loading: true });
		try {
            
			const res = await axios.post("/category", category);
			
		} catch (error) {
			toast.error(error.response.data.error || "Failed to create category");
			set({ loading: false });
		}
	},


}))