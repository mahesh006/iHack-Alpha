import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_svg/svg.dart';

class Fartwo extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return FartwoState();
  }
}

class FartwoState extends State<Fartwo> {
  InAppWebViewController webView;
  bool showErrorPage = false;
  double progress = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFFC7B8F5),
        elevation: 0.0,
        leading: InkWell(
          onTap: () {
            Navigator.pop(context);
          },
          child: Align(
            alignment: Alignment.topRight,
            child: Container(
              alignment: Alignment.center,
              height: 52,
              width: 52,
              decoration: BoxDecoration(
                //color: kBlueLightColor,
                shape: BoxShape.circle,
              ),
              child: SvgPicture.asset("assets/icons/previous.svg"),
            ),
          ),
        ),
      ),
      body: Container(
          child: Column(children: <Widget>[
        Expanded(
            child: Stack(
          children: <Widget>[
            InkWell(
              onTap: () {
                Navigator.pop(context);
              },
              child: Align(
                alignment: Alignment.topRight,
                child: Container(
                  alignment: Alignment.center,
                  height: 52,
                  width: 52,
                  decoration: BoxDecoration(
                    //color: kBlueLightColor,
                    shape: BoxShape.circle,
                  ),
                  child: SvgPicture.asset("assets/icons/previous.svg"),
                ),
              ),
            ),
            SizedBox(
              height: 30.0,
            ),
            Align(
              alignment: Alignment.center,
              child: InAppWebView(
                  initialUrl: "https://artificial-voice.herokuapp.com/normalchatlogin",
                  initialHeaders: {},
                  initialOptions: InAppWebViewGroupOptions(
                    crossPlatform: InAppWebViewOptions(
                        debuggingEnabled: true,
                        preferredContentMode: UserPreferredContentMode.DESKTOP),
                  ),
                  onWebViewCreated: (InAppWebViewController controller) {
                    webView = controller;
                  },
                  onLoadStart:
                      (InAppWebViewController controller, String url) {},
                  onLoadStop:
                      (InAppWebViewController controller, String url) async {},
                  onLoadError: (InAppWebViewController controller, String url,
                      int i, String s) async {
                    showError();
                  },
                  onLoadHttpError: (InAppWebViewController controller,
                      String url, int i, String s) async {
                    showError();
                  },
                  onProgressChanged:
                      (InAppWebViewController controller, int progress) {
                    setState(() {
                      this.progress = progress / 100;
                    });
                  },
                  androidOnPermissionRequest:
                      (InAppWebViewController controller, String origin,
                          List<String> resources) async {
                    return PermissionRequestResponse(
                        resources: resources,
                        action: PermissionRequestResponseAction.GRANT);
                  }),
            ),
            Align(alignment: Alignment.center, child: _buildProgressBar()),
          ],
        )),
        showErrorPage
            ? Center(
                child: Container(
                  color: Colors.white,
                  alignment: Alignment.center,
                  height: double.infinity,
                  width: double.infinity,
                  child: Text('Page failed to open (WIDGET)'),
                ),
              )
            : SizedBox(height: 10.0, width: 10.0),
      ])),
    );
  }

  Widget _buildProgressBar() {
    if (progress != 1.0) {
      return CircularProgressIndicator(
        valueColor: AlwaysStoppedAnimation<Color>(Colors.greenAccent),
      );
    }
    return Container();
  }

  void showError() {
    setState(() {
      showErrorPage = true;
    });
  }

  void hideError() {
    setState(() {
      showErrorPage = false;
    });
  }
}
