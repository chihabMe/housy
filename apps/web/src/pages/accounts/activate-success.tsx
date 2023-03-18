import Link from "next/link";
import React from "react";

const activateSuccessPage = () => {
  return (
    <div>
      activated successfully please
      <div>
        <Link href="/auth/login">login</Link>
      </div>
    </div>
  );
};

export default activateSuccessPage;
