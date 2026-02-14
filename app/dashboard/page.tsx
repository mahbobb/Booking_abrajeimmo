"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: number;
  status: string;
  mainImage?: string;
  city: { name: string };
  createdAt: string;
}

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  product: {
    id: number;
    title: string;
    mainImage?: string;
    price: number;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "bookings">("products");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/");
          return;
        }
        setUser(data.user);
      })
      .catch(() => router.push("/"));
  }, [router]);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      fetch("/api/products/my").then((res) => res.json()),
      fetch("/api/bookings/my").then((res) => res.json()),
    ])
      .then(([productsData, bookingsData]) => {
        setProducts(productsData.products || []);
        setBookings(bookingsData.bookings || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user?.name} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos annonces et réservations depuis votre tableau de bord
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Annonces actives</p>
                <p className="text-2xl font-bold">
                  {products.filter((p) => p.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Réservations</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Revenus estimés</p>
                <p className="text-2xl font-bold">
                  {products.reduce((sum, p) => sum + p.price, 0)} MAD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "products"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Mes annonces ({products.length})
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Mes réservations ({bookings.length})
              </button>
            </nav>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            {activeTab === "products" ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Mes annonces</h2>
                  <Link
                    href="/products/new"
                    className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle annonce
                  </Link>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Aucune annonce
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Commencez par créer votre première annonce
                    </p>
                    <Link
                      href="/products/new"
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Créer une annonce
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="relative h-48">
                          <Image
                            src={product.mainImage || "/placeholder-image.jpg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                              {product.status === "active" ? "Actif" : "Inactif"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{product.city.name}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-blue-600">{product.price} MAD</span>
                            <Link
                              href={`/products/${product.id}/edit`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Modifier
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-6">Mes réservations</h2>

                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Aucune réservation
                    </h3>
                    <p className="text-gray-500">
                      Vous n'avez pas encore de réservations
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={booking.product.mainImage || "/placeholder-image.jpg"}
                              alt={booking.product.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{booking.product.title}</h3>
                                <p className="text-sm text-gray-600">
                                  {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${getBookingStatusColor(booking.status)}`}>
                                {booking.status === "confirmed" ? "Confirmée" : 
                                 booking.status === "pending" ? "En attente" : "Annulée"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span className="font-bold text-blue-600">
                                {booking.product.price} MAD
                              </span>
                              <div className="flex gap-2">
                                <button className="text-sm text-blue-600 hover:text-blue-800">
                                  Détails
                                </button>
                                {booking.status === "pending" && (
                                  <button className="text-sm text-red-600 hover:text-red-800">
                                    Annuler
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/products/new"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Créer une annonce</p>
                <p className="text-sm text-gray-500">Publiez un nouveau produit</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Mon profil</p>
                <p className="text-sm text-gray-500">Modifier mes informations</p>
              </div>
            </Link>

            <Link
              href="/bookings"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Toutes mes réservations</p>
                <p className="text-sm text-gray-500">Voir l'historique complet</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}