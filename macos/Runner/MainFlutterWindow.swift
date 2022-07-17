import Cocoa
import FlutterMacOS

class MainFlutterWindow: NSWindow {
  override func awakeFromNib() {
    let flutterViewController = FlutterViewController.init()
    let windowFrame = self.frame
    self.contentViewController = flutterViewController
    self.setFrame(windowFrame, display: true)
    self.setContentSize(NSSize(width: 400,height: 300))
    self.titleVisibility = NSWindow.TitleVisibility.hidden  
    self.titlebarAppearsTransparent = true


    RegisterGeneratedPlugins(registry: flutterViewController)

    super.awakeFromNib()
  }
}
