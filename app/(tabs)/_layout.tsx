import { Tabs } from "expo-router";
import { Dimensions, Image, ImageBackground, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({focused, title, icon}: any) => {
    return (
        <ImageBackground
            style={
                {
                    backgroundColor: focused? 'lightblue': '',
                    borderRadius: 50,
                    marginTop: 21,
                    overflow: 'hidden',
                    minWidth: 200,
                    minHeight: 60,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    // borderColor: 'red',
                    // borderWidth: 2,
                    // borderStyle: 'solid'
                }
            }
        >
            <Ionicons name={focused? icon: icon+"-outline"} style={{
                fontSize: 28,
                color: focused?'#013cff':'#c0c0c0',
            }} />
            {focused && <Text
            style={{
                fontSize: 16,
                fontWeight: 500,
            }}
            >
                {title}
            </Text>}
        </ImageBackground>
    )
}

export default function Tablayout() {
    const insets = useSafeAreaInsets();
    
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#2f2d9b',
                    height: 60,
                    width: 350,
                    marginHorizontal: 'auto',
                    marginBottom: insets.bottom,
                    borderRadius: 50,
                    flexDirection: "row",
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    // marginTop: 30,
                    // borderColor: 'green',
                    // borderWidth: 2,
                    // borderStyle: 'solid'
                },
                tabBarHideOnKeyboard: true,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused}) => (
                        <TabIcon focused={focused} title="Home" icon={"home"} />
                    )
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ focused}) => (
                        <TabIcon focused={focused} title="History" icon={"clipboard"} />
                    )
                }}
            />
        </Tabs>
    );
}