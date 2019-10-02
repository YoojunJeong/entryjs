doUserTask
{
while(true)
{
	speaker0.setTune(F_DO_6, __melodyVolume);
	sleep(500);
	speaker0.setTune(F_DO_6, 0);
	sleep(200);
	speaker0.setTune(F_DO_6, __melodyVolume);
	sleep(500);
	speaker0.setTune(F_DO_6, 0);
	sleep(200);
	speaker0.setTune(F_DO_6, __melodyVolume);
	sleep(500);
	speaker0.setTune(F_DO_6, 0);
	sleep(200);
	speaker0.setTune(F_DO_7, __melodyVolume);
	sleep(1000);
	speaker0.setTune(F_DO_7, 0);
	sleep(1000);
	}
}