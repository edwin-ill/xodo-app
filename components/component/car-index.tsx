import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { EmblaCarousel } from '@/components/component/EmblaCarousel';

interface VehicleImage {
  id: number;
  vehicleId: number;
  imageUrl: string;
}

interface Dealership {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
}

interface Car {
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
}

interface AdditionalInfo {
  EngineModel: string;
  FuelTypePrimary: string;
  DriveType: string;
  BodyClass: string;
}

export function CarIndex({ id }: { id: number }) {
  const [car, setCar] = useState<Car | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  }

  useEffect(() => {
    const fetchCarData = async () => {
      if (id) {
        try {
          const response = await axios.get(`https://localhost:7126/api/v1/Vehicle/${id}`);
          setCar(response.data.data);

          if (response.data.data.vin) {
            const secondaryResponse = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${response.data.data.vin}?format=json`);
            setAdditionalInfo(secondaryResponse.data.Results[0]);
          }
        } catch (error) {
          console.error('Error fetching car data:', error);
        }
      }
    };

    fetchCarData();
  }, [id]);

  if (!car) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  const hasSingleImage = car.vehicleImages.length === 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="grid gap-6">
          <div className={`grid ${hasSingleImage ? 'grid-cols-1' : 'lg:grid-cols-5'} gap-4 items-start`}>
            {!hasSingleImage && (
              <div className="lg:col-span-1 flex lg:flex-col gap-4 items-start overflow-x-auto lg:overflow-y-auto lg:max-h-[700px]">
                {car.vehicleImages.map((image, index) => (
                  index !== currentSlide && (
                    <img
                      key={image.id}
                      src={image.imageUrl}
                      alt={`${car.carMake} ${car.model}`}
                      className="w-full aspect-[3/2] object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300"
                      onClick={() => handleSlideChange(index)}
                    />
                  )
                ))}
              </div>
            )}
            <div className={hasSingleImage ? 'col-span-1' : 'lg:col-span-4'}>
              <div className="aspect-[16/9] w-full">
                <EmblaCarousel 
                  vehicleImages={car.vehicleImages} 
                  options={{ loop: car.vehicleImages.length > 1 }} 
                  onSlideChange={handleSlideChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-8 items-start bg-white p-6 rounded-lg shadow-md">
          <div>
            <h1 className="font-bold text-3xl lg:text-4xl mb-4 text-gray-800">{car.year} {car.carMake} {car.model}</h1>
            <div className="grid gap-2">
              <div className="text-3xl font-bold text-green-600">${car.price.toLocaleString()}</div>
              <div className="text-gray-600">{car.mileage.toLocaleString()} miles</div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Description</h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Vehicle Details</h2>
            <ul className="grid grid-cols-2 gap-4 text-gray-600">
              <li><span className="font-semibold">VIN:</span> {car.vin}</li>
              <li><span className="font-semibold">Engine:</span> {car.engineType}</li>
              <li><span className="font-semibold">Transmission:</span> {car.transmissionType}</li>
              <li><span className="font-semibold">Body Style:</span> {car.vehicleType}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700">Name</Label>
              <Input id="name" placeholder="Enter your name" className="border-gray-300" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" className="border-gray-300" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-gray-700">Message</Label>
              <Textarea id="message" placeholder="Enter your message" rows={5} className="border-gray-300" />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Submit
            </Button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Dealership Information</h2>
          <ul className="grid gap-3 text-gray-600">
            <li><span className="font-semibold">Name:</span> {car.dealership.name}</li>
            <li><span className="font-semibold">Address:</span> {car.dealership.address}, {car.dealership.city}</li>
            <li><span className="font-semibold">Phone:</span> {car.dealership.phoneNumber}</li>
            <li><span className="font-semibold">Email:</span> {car.dealership.email}</li>
          </ul>
        </div>
      </div>      
    </div>
  );
}