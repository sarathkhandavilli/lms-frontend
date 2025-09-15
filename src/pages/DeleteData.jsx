import React from "react";

const DeleteData = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          User Data Deletion
        </h1>
        <p className="text-gray-600 mb-4">
          If you would like to delete your account and all personal data
          collected by our app, please contact us at:
        </p>
        <p className="text-lg font-semibold text-blue-600">
          <a href="mailto:sarathchandra573@gmail.com">
            sarathchandra573@gmail.com
          </a>
        </p>
        <p className="text-gray-600 mt-4">
          Please include the subject line <strong>“Delete My Data”</strong> in
          your email. We will process your request within 7 business days.
        </p>
      </div>
    </div>
  );
};

export default DeleteData;
