import { useState } from "react";
import api from "../../services/api.js";

export default function SellProduct() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "Used",
  });

  // uploaded image files
  const [images, setImages] = useState([]);

  // preview image urls
  const [previewImages, setPreviewImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const categories = [
    "Books",
    "Electronics",
    "Furniture",
    "Hostel",
    "Others",
  ];

  // handle input changes
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  // handle image upload
  const handleImageChange = (e) => {

    setError("");

    const files =
      Array.from(e.target.files);

    // check max images
    if (
      images.length + files.length > 4
    ) {

      return setError(
        "Maximum 4 images allowed"
      );

    }

    // append images
    setImages((prevImages) => [

      ...prevImages,
      ...files,

    ]);

    // generate preview urls
    const previewUrls =
      files.map((file) =>
        URL.createObjectURL(file)
      );

    // append previews
    setPreviewImages((prevPreviews) => [

      ...prevPreviews,
      ...previewUrls,

    ]);
  };

  // remove image
  const removeImage = (index) => {

    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setPreviewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // submit form
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      // validation
      if (images.length < 1) {

        setLoading(false);

        return setError(
          "Upload atleast 1 image"
        );
      }

      // create form data
      const formData =
        new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "condition",
        form.condition
      );

      // append images
      images.forEach((img) => {

        formData.append(
          "images",
          img
        );

      });

      // api request
      await api.post(
        "/products/add",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      // success message
      setSuccess(
        "Product listed successfully ✔"
      );

      // reset form
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "Used",
      });

      setImages([]);
      setPreviewImages([]);

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Failed to add product"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-slate-50 flex justify-center items-center px-4 py-10">

      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-lg p-8">

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            N
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Sell Product
          </h1>

          <p className="text-slate-500 mt-2">
            Create a listing and reach students
            across campus
          </p>

        </div>

        {/* SUCCESS */}
        {success && (

          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center">
            {success}
          </div>

        )}

        {/* ERROR */}
        {error && (

          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center">
            {error}
          </div>

        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Product Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Engineering Mathematics Book"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe your product..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          {/* PRICE + CATEGORY */}
          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium mb-2">
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="Enter price"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((cat) => (

                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>

                ))}

              </select>

            </div>

          </div>

          {/* IMAGE UPLOAD */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Product Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white"
            />

            <p className="text-sm text-slate-500 mt-2">
              Upload 1 to 4 images
            </p>

          </div>

          {/* IMAGE PREVIEW */}
          {previewImages.length > 0 && (

            <div className="grid grid-cols-2 gap-4">

              {previewImages.map(
                (img, index) => (

                  <div
                    key={index}
                    className="relative rounded-2xl overflow-hidden border"
                  >

                    <img
                      src={img}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />

                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm"
                    >
                      ✕
                    </button>

                  </div>
                )
              )}

            </div>
          )}

          {/* CONDITION */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Condition
            </label>

            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >

              <option value="New">
                New
              </option>

              <option value="Like New">
                Like New
              </option>

              <option value="Used">
                Used
              </option>

            </select>

          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-medium transition ${
              loading
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >

            {loading
              ? "Publishing..."
              : "Publish Product"}

          </button>

        </form>

      </div>

    </div>
  );
}