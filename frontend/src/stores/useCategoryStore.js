import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";


export const useCategoryStore = create((set, get) => ({
    categories: [],
    count: [],
    loading: false,

    getCategories: async () => {
		
		try {
			const response = await axios.get(`/category`);
            
			set({ categories: response.data.cat, loading: false });

		} catch (error) {
			toast.error(error.response.data.error || "Failed to fetch categories");
		}
	},
    createCategory: async (category) => {
		set({ loading: true });
		try {
            
			const res = await axios.post("/category", category);
            toast.success("Category Created")

            get().getCategories()
			set({ loading: false });
		} catch (error) {
			toast.error(error.response.data.error || "Failed to create category");
			set({ loading: false });
		}
	},
    deleteCategory: async (categoryId) => {
		set({ loading: true });
		try {
			await axios.delete(`/category/${categoryId}`);
            
            set((prevCategories) => ({
				categories: prevCategories.categories.filter((category) => category._id !== categoryId),
				loading: false,
			}));

            toast.success("Category Deleted")

		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete category");
		}
	},
    categoryCount: async(categoryRef) => {
        set({ loading: true, count: [] });
		try {
			const res = await axios.get(`/category/count/${categoryRef}`);

            set((prevState) => ({
				count: [...prevState.count, res.data.cat],
				loading: false,
			}));
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
    },
    
}))