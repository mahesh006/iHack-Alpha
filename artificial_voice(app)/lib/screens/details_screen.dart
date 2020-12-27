import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:artificial_voice/constants.dart';
import 'package:artificial_voice/screens/far-1.dart';
import 'package:artificial_voice/screens/far-2.dart';

class DetailsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    return Scaffold(
      body: Stack(
        children: <Widget>[
          Container(
            height: size.height,
            decoration: BoxDecoration(
              color: kBlueLightColor,
              image: DecorationImage(
                image: AssetImage("assets/images/background.png"),
                fit: BoxFit.fitWidth,
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
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
                    SizedBox(height: size.height * .28),
                    Wrap(
                      spacing: 20,
                      runSpacing: 20,
                      children: <Widget>[
                        SeassionCard(
                          svgSrc: "assets/icons/pic.svg",
                          seassionNum: "BlindDeaf User",
                          press: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) {
                                return Farone();
                              }),
                            );
                          },
                        ),
                        SeassionCard(
                          svgSrc: "assets/icons/near.svg",
                          seassionNum: "CareTaker",
                          press: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) {
                                return Fartwo();
                              }),
                            );
                          },
                        ),
                      ],
                    ),
                    SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class SeassionCard extends StatelessWidget {
  final String seassionNum;
  final String svgSrc;
  final Function press;
  const SeassionCard({
    Key key,
    this.seassionNum,
    this.svgSrc,
    this.press,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraint) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(13),
        child: Container(
          width: constraint.maxWidth -
              16, // constraint.maxWidth provide us the available with for this widget
          // padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(13),
            boxShadow: [
              BoxShadow(
                offset: Offset(0, 17),
                blurRadius: 23,
                spreadRadius: -13,
                color: kShadowColor,
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: press,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: <Widget>[
                    Container(
                      height: 52,
                      width: 43,
                      child: SvgPicture.asset(svgSrc),
                    ),
                    SizedBox(width: 10),
                    Container(
                      width: double.infinity,
                      child: Text(
                        "$seassionNum",
                        style: Theme.of(context).textTheme.title,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
    });
  }
}
