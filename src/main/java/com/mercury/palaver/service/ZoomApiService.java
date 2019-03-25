package com.mercury.palaver.service;

import com.mercury.palaver.domain.Meeting;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
@Transactional
public class ZoomApiService {

    private String url = "https://api.zoom.us/v2/users/kQhwZBuET_GXqr2jjAk5kA/meetings";
    private String jwtAuthorization = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImNLV0F3b1BhUnRXR3RpbHJlWHRKd0EiLCJleHAiOjE1NTY2NzA5MDAsImlhdCI6MTU1MzM4MjM3OX0.te7ASArmW9QXnszHGLxhw9h0V_RcZ0qoVUXTJUIvT4E";

    private String getResult(HttpResponse response) {
        BufferedReader rd = null;

        System.out.println("Response Code : " + response.getStatusLine().getStatusCode());
        try {
            rd = new BufferedReader(
                new InputStreamReader(response.getEntity().getContent()));
            StringBuffer result = new StringBuffer();
            String line = "";
            while ((line = rd.readLine()) != null) {
                result.append(line);
            }

            return result.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Meeting createMeeting(Meeting meeting) {
        HttpResponse response = null;
        String result = null;
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);

        String json = "{\n" +
            "  \"topic\": \"" + meeting.getName() + "\",\n" +
            "  \"type\": 2,\n" +
            "  \"start_time\": \"" + meeting.getTime() + "\",\n" +
            "  \"duration\": 40,\n" +
            "  \"timezone\": \"America/Costa_Rica\",\n" +
            "  \"password\": \"1234TestP\",\n" +
            "  \"agenda\": \"" + meeting.getName() + "\"\n" +
            "}";
        try {
            StringEntity entity = new StringEntity(json);

            httpPost.setEntity(entity);
            httpPost.setHeader("Accept", "application/json");
            httpPost.setHeader("Content-type", "application/json");
            httpPost.setHeader("Authorization", jwtAuthorization);
            response = client.execute(httpPost);
            result = this.getResult(response);
            client.close();
            JSONObject meetingURLS = new JSONObject(result);
            meeting.setCallURL(meetingURLS.getString("start_url"));
            meeting.setCallCode(meetingURLS.getString("join_url"));
            return meeting;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }
}
