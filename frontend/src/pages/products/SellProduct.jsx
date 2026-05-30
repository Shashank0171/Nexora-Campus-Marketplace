import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function SellProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "Used",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const categories = ["Books", "Electronics", "Furniture", "Hostel", "Others"];

  // cleanup object URLs (IMPORTANT FIX)
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setError("");

    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (images.length + files.length > 4) {
      return setError("Maximum 4 images allowed");
    }

    // validation
    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        return setError("Only image files are allowed");
      }
      if (file.size > 2 * 1024 * 1024) {
        return setError("Each image must be under 2MB");
      }
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setPreviewImages((prev) => {
      URL.revokeObjectURL(prev[index]); // cleanup single URL
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // frontend validation
    if (!form.title.trim()) return setError("Title is required");
    if (!form.description.trim()) return setError("Description is required");
    if (!form.price || Number(form.price) <= 0)
      return setError("Enter valid price");
    if (!form.category) return setError("Select category");
    if (images.length === 0) return setError("Upload at least 1 image");

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      await api.post("/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Product listed successfully ✔");

      setTimeout(() => {
        setForm({
          title: "",
          description: "",
          price: "",
          category: "",
          condition: "Used",
        });
        setImages([]);
        setPreviewImages([]);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center px-4 py-10">

      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-lg p-8">

        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            N
          </div>
          <h1 className="text-3xl font-bold mt-4">Sell Product</h1>
          <p className="text-slate-500 mt-2">
            Create a listing and reach students
          </p>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded-xl"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border p-3 rounded-xl"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl bg-white"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-3 rounded-xl bg-white"
          />

          <div className="grid grid-cols-2 gap-3">
            {previewImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  className="h-32 w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl bg-white"
          >
            <option>New</option>
            <option>Like New</option>
            <option>Used</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Product"}
          </button>

        </form>
      </div>
    </div>
  );
}