'use client'

import CarViewDataContent from "@/components/CarDetailsComponent/CarViewDataContent";
import { Suspense } from "react";

const CarDetailsView = () => {

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <CarViewDataContent />
            </Suspense>
        </>
    )
}

export default CarDetailsView;