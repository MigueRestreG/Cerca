export const apiCities = [
	{ id: 'bogota', label: 'Bogotá', lat: 4.711, lng: -74.0721 },
	{ id: 'medellin', label: 'Medellín', lat: 6.2442, lng: -75.5812 },
	{ id: 'cali', label: 'Cali', lat: 3.4516, lng: -76.532 },
	{ id: 'barranquilla', label: 'Barranquilla', lat: 10.9685, lng: -74.7813 },
	{ id: 'cartagena', label: 'Cartagena', lat: 10.391, lng: -75.4794 },
	{ id: 'bucaramanga', label: 'Bucaramanga', lat: 7.1193, lng: -73.1227 },
] as const;

export type ApiCityId = (typeof apiCities)[number]['id'];
