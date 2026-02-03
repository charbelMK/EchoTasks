'use client'

import { useState } from 'react'

export default function WorryCalculator() {
    const [hours, setHours] = useState(5)

    // Assumptions: Value of peace of mind is subjective, but we can quantify time saved x "stress factor"
    const stressFactor = 50 // Arbitrary value per hour of worry ($)
    const annualSavings = hours * stressFactor * 12

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-primary px-6 py-6 sm:px-10">
                <h3 className="text-xl font-bold text-white text-center">
                    The &quot;Worry Calculator&quot;
                </h3>
                <p className="text-indigo-100 text-center text-sm mt-2">
                    How much is stress costing you?
                </p>
            </div>
            <div className="p-6 sm:p-10">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                            Hours spent worrying about Kenya projects monthly:
                        </label>
                        <div className="mt-4 flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="40"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                            <span className="text-2xl font-bold text-primary w-12 text-center">{hours}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-gray-500 text-sm">Estimated Annual &quot;Stress Cost&quot;</p>
                        <p className="text-4xl font-extrabold text-accent mt-2">
                            ${annualSavings.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            *Based on estimated value of your time and peace of mind
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            EchoTasks starts at just a fraction of this cost.
                        </p>
                        <a href="/services" className="text-primary font-semibold hover:text-blue-700">
                            See our pricing →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
