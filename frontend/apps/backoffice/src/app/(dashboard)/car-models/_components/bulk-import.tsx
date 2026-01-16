"use client";

import { useState, useRef } from "react";
import {
  useCreateCarModelsBulk,
  useGetManufacturers,
  useQueryClient,
  getGetCarModelsQueryKey,
} from "@workspace/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import type { CreateCarModelsBulkCommand } from "@workspace/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function BulkImportCarModels() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [importErrors, setImportErrors] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<{
    successCount: number;
    errorCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: manufacturersData } = useGetManufacturers({
    query: {},
  });

  // Create a manufacturer lookup map for better performance
  const manufacturerMap =
    manufacturersData?.reduce(
      (acc, manufacturer) => {
        if (manufacturer.title && manufacturer.id) {
          acc[manufacturer.title.toLowerCase()] = manufacturer.id;
        }
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  const createCarModelsBulkMutation = useCreateCarModelsBulk({
    mutation: {
      onSuccess: (response) => {
        const successCount = response.successfulCount || 0;
        const errorCount = response.errors?.length || 0;

        setImportResults({
          successCount,
          errorCount,
        });

        if (errorCount > 0 && response.errors) {
          setImportErrors(response.errors);
          setShowErrors(true);
        } else {
          toast.success(
            `Bulk import completed! ${successCount} car models imported successfully`
          );
          resetForm();
          setIsOpen(false);
        }

        // Invalidate car models query to refresh the main table
        queryClient.invalidateQueries({ queryKey: getGetCarModelsQueryKey() });

        setIsUploading(false);
        setUploadProgress(100);
      },
      onError: (error) => {
        toast.error("Failed to import car models: " + error.message);
        setIsUploading(false);
        setUploadProgress(0);
      },
    },
  });

  const resetForm = () => {
    setFile(null);
    setPreviewData([]);
    setShowPreview(false);
    setShowErrors(false);
    setImportErrors([]);
    setImportResults(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile);
        parseExcelFile(selectedFile);
      } else {
        toast.error("Please select a valid Excel file (.xlsx or .xls)");
      }
    }
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error("No sheet found in Excel file");
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error("Worksheet not found in Excel file");
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel columns to expected format
        const mappedData = jsonData
          .map((row: any) => {
            // Find manufacturer by name or ID
            let manufacturerId = null;
            if (row.manufacturerId && typeof row.manufacturerId === "number") {
              manufacturerId = row.manufacturerId;
            } else if (row.manufacturer || row.manufacturerName) {
              const manufacturerName = (
                row.manufacturer || row.manufacturerName
              )
                ?.toString()
                .trim();
              if (manufacturerName) {
                manufacturerId =
                  manufacturerMap[manufacturerName.toLowerCase()] || null;
              }
            }

            return {
              name: row.name || row.Name || row["Car Model"] || "",
              slug: row.slug || row.Slug || row["Slug"] || "",
              image: row.image || row.Image || row["Image URL"] || null,
              manufacturerId: manufacturerId,
            };
          })
          .filter((item) => item.name && item.manufacturerId); // Filter out rows with missing required data

        setPreviewData(mappedData.slice(0, 5)); // Show first 5 rows for preview
        setShowPreview(true);

        // Debug logging
        console.log("Manufacturers data:", manufacturersData);
        console.log("Manufacturer map:", manufacturerMap);
        console.log("Parsed rows from Excel:", jsonData.length);
        console.log("Mapped rows (after filtering):", mappedData.length);
      } catch (error) {
        toast.error(
          "Failed to parse Excel file. Please check the format and column names."
        );
        console.error("Excel parsing error:", error);
        console.error(
          "Manufacturers data available:",
          manufacturersData?.length || 0
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!file || !previewData.length) {
      toast.error("Please select a valid Excel file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Read and parse the full file
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error("No sheet found in Excel file");
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error("Worksheet not found in Excel file");
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setUploadProgress(30);

        // Map all data (not just preview)
        const mappedData = jsonData
          .map((row: any) => {
            let manufacturerId = null;
            if (row.manufacturerId && typeof row.manufacturerId === "number") {
              manufacturerId = row.manufacturerId;
            } else if (row.manufacturer || row.manufacturerName) {
              const manufacturerName = (
                row.manufacturer || row.manufacturerName
              )
                ?.toString()
                .trim();
              if (manufacturerName) {
                manufacturerId =
                  manufacturerMap[manufacturerName.toLowerCase()] || null;
              }
            }

            return {
              name: row.name || row.Name || row["Car Model"] || "",
              slug: row.slug || row.Slug || row["Slug"] || "",
              image: row.image || row.Image || row["Image URL"] || null,
              manufacturerId: manufacturerId,
            };
          })
          .filter((item) => item.name && item.manufacturerId);

        // Debug logging for upload
        console.log("Upload - Parsed rows from Excel:", jsonData.length);
        console.log(
          "Upload - Mapped rows (after filtering):",
          mappedData.length
        );

        setUploadProgress(50);

        const bulkCommand: CreateCarModelsBulkCommand = {
          carModels: mappedData,
        };

        setUploadProgress(70);

        createCarModelsBulkMutation.mutate({ data: bulkCommand });
        setUploadProgress(100);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error("Failed to process file");
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a template Excel file
    const templateData = [
      {
        name: "Camry",
        slug: "camry-2024",
        image: "cdn/2024/05/image.jpg",
        manufacturer: "Toyota", // or manufacturerId: 1
      },
      {
        name: "Accord",
        slug: "accord-2024",
        image: "cdn/2024/05/image2.jpg",
        manufacturer: "2", // or manufacturerId: 2
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Car Models");
    XLSX.writeFile(wb, "car-models-template.xlsx");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showErrors ? "Import Results" : "Bulk Import Car Models"}
          </DialogTitle>
          <DialogDescription>
            {showErrors
              ? `Import completed with ${importResults?.successCount} successful and ${importResults?.errorCount} failed items.`
              : "Import car models from an Excel file. Download the template to see the expected format."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {showErrors ? (
            // Error Results View
            <div className="space-y-4">
              {/* Success/Error Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">
                        Successful Imports
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {importResults?.successCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Failed Imports</p>
                      <p className="text-2xl font-bold text-red-600">
                        {importResults?.errorCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Details Table */}
              {importErrors.length > 0 && (
                <div className="space-y-2">
                  <Label>Error Details</Label>
                  <div className="max-h-60 overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Errors</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importErrors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {error.index}
                            </TableCell>
                            <TableCell>{error.name}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {error.errorMessages?.map(
                                  (errorMsg: string, msgIndex: number) => (
                                    <Badge
                                      key={msgIndex}
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      {errorMsg}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Import Form View
            <>
              {/* Download template */}
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <Download className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Download Template</p>
                  <p className="text-xs text-muted-foreground">
                    Get the Excel template with the correct format
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Template
                </Button>
              </div>
            </>
          )}

          {!showErrors && (
            <>
              {/* File upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Select Excel File</Label>
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="space-y-2">
                  <Label>Data Preview (first 5 rows)</Label>
                  {previewData.length > 0 ? (
                    <>
                      <div className="max-h-40 overflow-auto border rounded-md p-2">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-1">Name</th>
                              <th className="text-left p-1">Slug</th>
                              <th className="text-left p-1">Manufacturer</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((row, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-1">{row.name}</td>
                                <td className="p-1">{row.slug}</td>
                                <td className="p-1">
                                  {row.manufacturerId
                                    ? manufacturersData?.find(
                                        (m) => m.id === row.manufacturerId
                                      )?.title || `ID: ${row.manufacturerId}`
                                    : "Not found"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {previewData.length} rows ready to import
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-orange-600 p-3 border border-orange-200 rounded-md bg-orange-50">
                      ⚠️ No valid data found. Make sure your Excel file has
                      columns named "name", "slug", and "manufacturer" and that
                      manufacturer names match exactly with existing
                      manufacturers in the system.
                    </div>
                  )}
                </div>
              )}

              {/* Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <Label>Uploading...</Label>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          {showErrors ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setShowErrors(false);
                  resetForm();
                }}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import Another File
              </Button>
              <Button onClick={() => setIsOpen(false)}>Done</Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || !previewData.length || isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Importing..." : "Import"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
