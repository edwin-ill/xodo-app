import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmblaCarousel } from '@/components/component/EmblaCarousel';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { X as XIcon } from 'lucide-react';

interface Car {
  id: number;
  vin: string;
  carMake: string;
  model: string;
  year: number;
  color: string;
  price: number;
  engineType: string;
  transmissionType: string;
  mileage: number;
  description: string;
  dealership: Dealership;
  vehicleImages: { id: number; vehicleId: number; imageUrl: string }[];
}
interface Dealership {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
}

interface NHTSAFeature {
  name: string;
  icon: string;
}

export function Carindex2({ id }: { id: number }) {
  const [car, setCar] = useState<Car | null>(null);
  const [features, setFeatures] = useState<NHTSAFeature[]>([]);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      if (id) {
        try {
          const response = await axios.get(`https://localhost:7126/api/v1/Vehicle/${id}`);
          setCar(response.data.data);

          if (response.data.data.vin) {
            const nhtsaResponse = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${response.data.data.vin}?format=json`);
            const nhtsaData = nhtsaResponse.data.Results.reduce((acc: any, item: any) => {
              acc[item.Variable] = item.Value;
              return acc;
            }, {});

            console.log('NHTSA Data:', nhtsaData); 

            const standardFeatures = [
              { name: 'RearVisibilitySystem', icon: 'VideoIcon', variable: 'Backup Camera' },
              { name: 'AdaptiveCruiseControl', icon: 'GaugeIcon', variable: 'Adaptive Cruise Control (ACC)' },
              { name: 'AutoReverseSystem', icon: 'ArrowLeftRightIcon', variable: 'Auto-Reverse System for Windows and Sunroofs' },
              { name: 'BlindSpotMon', icon: 'EyeIcon', variable: 'Blind Spot Warning (BSW)' },
              {name: 'KeylessIgnition', icon: 'KeyIcon', variable: 'Keyless Ignition' },
              { name: 'DaytimeRunningLight', icon: 'SunIcon', variable: 'Daytime Running Light (DRL)' },
              { name: 'ForwardCollisionWarning', icon: 'AlertTriangleIcon', variable: 'Forward Collision Warning (FCW)' },
              { name: 'ESC', icon: 'SteeringWheelIcon', variable: 'Electronic Stability Control (ESC)' },         
              { name: 'LaneDepartureWarning', icon: 'RoadIcon', variable: 'Lane Departure Warning (LDW)' }
              
            ].filter(feature => {
              console.log('Checking feature:', feature.name, 'with variable:', feature.variable, 'value:', nhtsaData[feature.variable]);
              return nhtsaData[feature.variable] === 'Standard';
            });

            setFeatures(standardFeatures);
            console.log('Standard Features:', standardFeatures);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <EmblaCarousel 
              vehicleImages={car.vehicleImages} 
              options={{ loop: car.vehicleImages.length > 1 }} 
            />
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Detalles del Vehículo</h2>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div><span className="font-semibold">Marca:</span> {car.carMake}</div>
                <div><span className="font-semibold">Modelo:</span> {car.model}</div>
                <div><span className="font-semibold">Año:</span> {car.year}</div>
                <div><span className="font-semibold">Color:</span> {car.color}</div>
                <div><span className="font-semibold">Kilometraje:</span> {car.mileage.toLocaleString()} km</div>
                <div><span className="font-semibold">Motor:</span> {car.engineType}</div>
                <div><span className="font-semibold">Transmisión:</span> {car.transmissionType}</div>
                <div><span className="font-semibold">VIN:</span> {car.vin}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Descripción</h2>
              <p className="text-gray-600 leading-relaxed">
                {car.description || "Esta es una descripción detallada del coche. Incluye toda la información necesaria sobre las características y especificaciones del coche."}
              </p>
            </CardContent>
          </Card>
          {features.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Características estándar</h2>
                <ul className="grid grid-cols-2 gap-4 text-gray-600">
                  {features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {getIcon(feature.icon)}
                      <span className="ml-2">{formatFeatureName(feature.name)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{car.year} {car.carMake} {car.model}</CardTitle>
              <CardDescription className="text-green-600 text-4xl font-semibold mt-2">
                ${car.price.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>D</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{car.dealership.name}</h3>
                  <p className="text-sm text-gray-500">{car.dealership.city}</p>
                </div>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => setIsContactFormOpen(true)}>Contactar con el dealer</Button>
              <div className="text-sm text-gray-500">
                <p>📞 {car.dealership.phoneNumber}</p>
                <p>📍 {car.dealership.address}, {car.dealership.city}</p>
                <p>✉️ {car.dealership.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ContactFormPopup 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
        carDetails={car}
      />
    </div>
  );
}

function ContactFormPopup({ isOpen, onClose, carDetails }) {

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    message: '',
    car: `${carDetails.vin} ${carDetails.year} ${carDetails.carMake} ${carDetails.model}`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await axios.post('https://localhost:7126/api/v1/contact', formData);
      if (response.status === 200) {
        alert('Formulario enviado exitosamente');
        onClose();
      } else {
        setSubmitError('Error al enviar el formulario. Inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitError('Error al enviar el formulario. Inténtelo de nuevo.');
    }

    setIsSubmitting(false);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Contactar con el dealer</h2>
            <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="senderName">Nombre</Label>
              <Input
                id="senderName"
                type="text"
                value={formData.senderName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="senderEmail">Correo electrónico</Label>
              <Input
                id="senderEmail"
                type="email"
                value={formData.senderEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="hidden"
              id="car"
              value={`${carDetails.vin} ${carDetails.year} ${carDetails.carMake} ${carDetails.model}`}
            />
            <div className="mb-4">
              {submitError && <p className="text-red-600">{submitError}</p>}
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white mr-2" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isSubmitting} 
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
function formatFeatureName(name: string): string {
  return name.split(/(?=[A-Z])/).join(' ');
}

function getIcon(iconName: string) {
  const icons = {
    BrakeDiscIcon,
    GaugeIcon,
    ArrowLeftRightIcon,
    EyeIcon,
    SunIcon,
    SteeringWheelIcon,
    AlertTriangleIcon,
    KeyIcon,
    RoadIcon,
    VideoIcon
  };
  const IconComponent = icons[iconName as keyof typeof icons];
  return <IconComponent className="w-5 h-5 text-red-600" />;
}

function BrakeDiscIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

function GaugeIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 14 4-4"/>
      <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
    </svg>
  )
}

function ArrowLeftRightIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3l4 4-4 4"/>
      <path d="M4 7h16"/>
      <path d="m16 21-4-4 4-4"/>
      <path d="M20 17H4"/>
    </svg>
  )
}

function EyeIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function SunIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  )
}

function SteeringWheelIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
      <path d="M12 2v2"/>
      <path d="M12 22v-2"/>
      <path d="m17 20.66-1-1.73"/>
      <path d="M11 10.27 7 3.34"/>
      <path d="m20.66 17-1.73-1"/>
      <path d="m3.34 7 1.73 1"/>
    </svg>
  )
}

function AlertTriangleIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  )
}

function KeyIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5"/>
      <path d="m21 2-9.6 9.6"/>
      <path d="m15.5 7.5 3 3L22 7l-3-3"/>
    </svg>
  )
}

function RoadIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 5v14"/>
      <path d="M16 5v14"/>
      <path d="M12 8v2"/>
      <path d="M12 14v2"/>
      <path d="M4 5h16"/>
      <path d="M4 19h16"/>
    </svg>
  )
}

function VideoIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8Z"/>
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
    </svg>
  )
}
