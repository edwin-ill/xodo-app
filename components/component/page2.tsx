"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmblaCarousel } from "@/components/component/EmblaCarousel";
import { useRouter } from 'next/navigation';

type Dealership = {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
};

type VehicleImage = {
  id: number;
  vehicleId: number;
  imageUrl: string;
};

type Car = {
  id: number;
  vin: string;
  carMake: string;
  model: string;
  year: number;
  color: string;
  price: number;
  engineType: string;
  status: string | null;
  transmissionType: string;
  mileage: number;
  description: string;
  dealershipId: number;
  vehicleType: string;
  dealership: Dealership;
  vehicleImages: VehicleImage[];
};

export default function Page2() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    minPrice: 0,
    maxPrice: 0,
    minYear: 0,
    maxYear: 0,
    minMileage: 0,
    maxMileage: 0,
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<{ succeeded: boolean, message: string, errors: any, data: Car[] }>("https://localhost:7126/api/v1/Vehicle");
        if (response.data.succeeded && Array.isArray(response.data.data)) {
          setCars(response.data.data);
        } else {
          throw new Error("Data format error");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const router = useRouter();
  const handleCarClick = (car) => {
    router.push(`/car/${car.vin}`);
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      return (
        (filters.make === "" || car.carMake.toLowerCase().includes(filters.make.toLowerCase())) &&
        (filters.model === "" || car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
        (filters.minPrice === 0 || car.price >= filters.minPrice) &&
        (filters.maxPrice === 0 || car.price <= filters.maxPrice) &&
        (filters.minYear === 0 || car.year >= filters.minYear) &&
        (filters.maxYear === 0 || car.year <= filters.maxYear) &&
        (filters.minMileage === 0 || car.mileage >= filters.minMileage) &&
        (filters.maxMileage === 0 || car.mileage <= filters.maxMileage)
      );
    });
  }, [filters, cars]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Find Your Dream Car</h1>
              <p className="text-lg md:text-xl text-gray-300">
                Browse our extensive inventory of high-quality vehicles.
              </p>
              <div className="flex gap-4">
                <Button size="lg">Shop Cars</Button>
                <Button variant="outline" size="lg">
                  Get Pre-Approved
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gray-100 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-[1fr_300px] gap-8">
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse Our Inventory</h2>
                  <p className="text-gray-500">Find the perfect car for you.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                      <div 
                        key={car.id} 
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" 
                        onClick={() => handleCarClick(car)}
                      >
                      <div className="relative w-full h-48">
                        <EmblaCarousel vehicleImages={car.vehicleImages} options={{ loop: true }} />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold">
                          {car.carMake} {car.model}
                        </h3>
                        <p className="text-gray-500">
                          {car.year} | {car.mileage} miles
                        </p>
                        <p className="text-2xl font-bold">${car.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Filters</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      type="text"
                      placeholder="Enter make"
                      value={filters.make}
                      onChange={(e) => handleFilterChange("make", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      type="text"
                      placeholder="Enter model"
                      value={filters.model}
                      onChange={(e) => handleFilterChange("model", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price-min">Price (min)</Label>
                    <Input
                      id="price-min"
                      type="number"
                      placeholder="Enter minimum price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price-max">Price (max)</Label>
                    <Input
                      id="price-max"
                      type="number"
                      placeholder="Enter maximum price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year-min">Year (min)</Label>
                    <Input
                      id="year-min"
                      type="number"
                      placeholder="Enter minimum year"
                      value={filters.minYear}
                      onChange={(e) => handleFilterChange("minYear", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year-max">Year (max)</Label>
                    <Input
                      id="year-max"
                      type="number"
                      placeholder="Enter maximum year"
                      value={filters.maxYear}
                      onChange={(e) => handleFilterChange("maxYear", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage-min">Mileage (min)</Label>
                    <Input
                      id="mileage-min"
                      type="number"
                      placeholder="Enter minimum mileage"
                      value={filters.minMileage}
                      onChange={(e) => handleFilterChange("minMileage", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage-max">Mileage (max)</Label>
                    <Input
                      id="mileage-max"
                      type="number"
                      placeholder="Enter maximum mileage"
                      value={filters.maxMileage}
                      onChange={(e) => handleFilterChange("maxMileage", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
