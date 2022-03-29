import LeftNavLayout from '../components/LeftNavLayout'

export default function PrivacyPage() {
  return (
    <LeftNavLayout pageTitle="Privacy Policy">
      <div className="bg-my-green text-white min-h-screen p-6">
        <div className="flex flex-col min-h-full max-w-2xl gap-4">
          <p className="text-2xl">
            Mysilio Garden doesn't store your data - everything you create here
            is stored in your <a className="link" href="https://solidproject.org/">Solid POD</a>.
          </p>
          <p>
            If you are using our POD hosting service (the default if you signed up with us),
            we store your data in our servers at <a className="link" href="https://mysilio.me/">https://mysilio.me/</a>.
            We will not sell or transfer your data without your permission, and you are free to move
            your data to servers hosted by other parties without discontinuing use of Mysilio Garden.
          </p>
          <p>
            Support for data migration to a new POD is currently very limited - if you'd like to move your data
            please reach out to us at <a className="link" href="mailto:hello@mysilio.com">hello@mysilio.com</a>
          </p>
        </div>
      </div>
    </LeftNavLayout>
  )
}
