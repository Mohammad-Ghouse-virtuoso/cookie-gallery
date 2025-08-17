export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-16 font-inter">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">We value your privacy. This page describes how we collect, use, and protect your information.</p>
        <div className="prose max-w-none text-gray-700">
          <h2>What we collect</h2>
          <ul>
            <li>Account details provided during sign-in</li>
            <li>Order information and preferences</li>
            <li>Technical and usage data to improve the site</li>
          </ul>
          <h2>How we use it</h2>
          <p>We use your data to process orders, improve our services, and communicate updates or offers with your consent.</p>
          <h2>Contact</h2>
          <p>If you have questions, please reach out to us via the Contact section.</p>
        </div>
      </div>
    </div>
  );
}

