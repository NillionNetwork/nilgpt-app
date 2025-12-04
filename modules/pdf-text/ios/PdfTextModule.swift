import ExpoModulesCore
import PDFKit

public class PdfTextModule: Module {
	public func definition() -> ModuleDefinition {
		Name("PdfText")
		
		AsyncFunction("getPageCount") { (filePath: String) -> Int in
			return try self.getPageCount(filePath: filePath)
		}
		
		AsyncFunction("getText") { (filePath: String) -> String in
			return try self.getText(filePath: filePath)
		}
	}
	
	//MARK:- Helper method to convert file path/URI to URL
	private func urlFromPath(_ filePath: String) -> URL? {
		if filePath.hasPrefix("file://") {
			return URL(string: filePath)
		}
		return URL(fileURLWithPath: filePath)
	}
	
	//MARK:- Helper method to create PDFDocument from file path
	private func pdfDocument(from filePath: String) throws -> PDFDocument {
		guard let fileURL = urlFromPath(filePath),
			  let pdfDocument = PDFDocument(url: fileURL) else {
			throw NSError(domain: "PdfTextModule", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to open PDF file"])
		}
		return pdfDocument
	}
	
	//MARK:- Method to get the page count of a PDF
	private func getPageCount(filePath: String) throws -> Int {
		return try pdfDocument(from: filePath).pageCount
	}
	
	//MARK:- Method to get text content from a PDF
	private func getText(filePath: String) throws -> String {
		let pdfDocument = try pdfDocument(from: filePath)
		let content = NSMutableString()
		
		for pageIndex in 0..<pdfDocument.pageCount {
			guard let page = pdfDocument.page(at: pageIndex),
				  let pageContent = page.string else { continue }
			content.append(pageContent)
		}
		
		return content as String
	}
}
