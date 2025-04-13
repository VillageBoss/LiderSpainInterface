import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation, useSearch } from "wouter";
import { Property } from "@shared/schema";
import PropertyGrid from "@/components/properties/PropertyGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_LOCATIONS,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import useTelegram from "@/hooks/useTelegram";

const Search = () => {
  const [_, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const { webApp } = useTelegram();
  
  const [filters, setFilters] = useState({
    category: params.get("category") || "",
    location: params.get("location") || "",
    minPrice: 1000000,
    maxPrice: 10000000,
    bedrooms: 0,
    query: params.get("query") || "",
  });

  // Format URL based on filters
  const getFilterUrl = () => {
    let url = "/api/properties?";
    const queryParams = [];
    
    if (filters.category) {
      queryParams.push(`category=${encodeURIComponent(filters.category)}`);
    }
    
    if (filters.location) {
      queryParams.push(`location=${encodeURIComponent(filters.location)}`);
    }
    
    if (filters.minPrice > 1000000) {
      queryParams.push(`minPrice=${filters.minPrice}`);
    }
    
    if (filters.maxPrice < 10000000) {
      queryParams.push(`maxPrice=${filters.maxPrice}`);
    }
    
    if (filters.bedrooms > 0) {
      queryParams.push(`bedrooms=${filters.bedrooms}`);
    }
    
    if (filters.query) {
      queryParams.push(`query=${encodeURIComponent(filters.query)}`);
    }
    
    return url + queryParams.join("&");
  };

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: [getFilterUrl()],
  });

  useEffect(() => {
    // Initialize filters from URL params
    const urlCategory = params.get("category");
    const urlLocation = params.get("location");
    const urlQuery = params.get("query");
    
    if (urlCategory || urlLocation || urlQuery) {
      setFilters({
        ...filters,
        category: urlCategory || "",
        location: urlLocation || "",
        query: urlQuery || ""
      });
    }
  }, [search]);

  useEffect(() => {
    // Set page title and BackButton functionality
    if (webApp) {
      document.title = "Search | LeaderSpain";
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        navigate("/");
      });
    }
  }, [webApp, navigate]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      location: "",
      minPrice: 1000000,
      maxPrice: 10000000,
      bedrooms: 0,
      query: "",
    });
  };
  
  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (filters.category) {
      newParams.set("category", filters.category);
    }
    
    if (filters.location) {
      newParams.set("location", filters.location);
    }
    
    if (filters.query) {
      newParams.set("query", filters.query);
    }
    
    const newSearch = newParams.toString();
    if (newSearch) {
      navigate(`/search?${newSearch}`);
    } else if (search) {
      navigate("/search");
    }
  }, [filters.category, filters.location, filters.query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-8"
    >
      <div className="container mx-auto">
        <motion.h1
          className="font-playfair text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Luxury Properties
        </motion.h1>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {PROPERTY_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Select
                value={filters.location}
                onValueChange={(value) => handleFilterChange("location", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {PROPERTY_LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <Select
                value={filters.bedrooms.toString()}
                onValueChange={(value) => handleFilterChange("bedrooms", parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Price Range: {formatCurrency(filters.minPrice)} - {formatCurrency(filters.maxPrice)}
            </label>
            <div className="px-2">
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                min={1000000}
                max={10000000}
                step={100000}
                onValueChange={(value) => {
                  handleFilterChange("minPrice", value[0]);
                  handleFilterChange("maxPrice", value[1]);
                }}
                className="my-6"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search properties..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="whitespace-nowrap"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <PropertyGrid
          properties={properties}
          isLoading={isLoading}
          emptyMessage="No properties match your search criteria. Try adjusting your filters."
        />
      </div>
    </motion.div>
  );
};

export default Search;
