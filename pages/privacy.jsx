import Nav from '../components/nav'

export default function PrivacyPage() {
  return (
    <div className="page bg-login-gradient text-white min-h-screen px-16">
      <div className="flex flex-col text-center bg-login-gradient text-white min-h-full">
        <h3 className="text-5xl my-12">Privacy at Mysilio Garden</h3>
        <p className="text-2xl my-6">
          Mysilio Garden doesn't store your data - everything you create here
          is stored in your <a className="link" href="https://solidproject.org/">Solid POD</a>.
        </p>
        <p>
          If you are using our POD hosting service (the default if you signed up with us),
          we store your data in our servers. We will not sell or transfer your data without your
          permission, and you are free to move your data to servers hosted by other parties
          without discontinuing use of Mysilio Garden.
        </p>
        <p>
          Support for data migration to a new POD is currently very limited - if you'd like to move your data
          please reach out to us at <a className="link" href="mailto:hello@mysilio.com">hello@mysilio.com</a>
        </p>
      </div>
    </div>
  )
}
